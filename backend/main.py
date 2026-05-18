from flask import request, jsonify
from config import app, db
from models import Course, Assessment

# helper functions
def get_user_key():
    return request.headers.get("X-User-Key")

# Courses
@app.route("/courses", methods=['GET'])
def get_courses():
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    courses = Course.query.filter_by(user_key=user_key).all()

    course_lst = []
    for c in courses:
        course_json = c.convert_to_json()
        course_lst.append(course_json)

    return jsonify(course_lst), 200

@app.route("/courses", methods=['POST'])
def create_courses():
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    user_data = request.get_json(silent=True) or {}
    course_name = user_data.get("name")

    if not course_name or not isinstance(course_name, str):
        return jsonify({"error": "Course 'name' is required and must be a string."}), 400

    exists = Course.query.filter_by(name=course_name, user_key=user_key).first()

    if exists:
        return jsonify({"error": "A course with that name already exists."}), 409

    course = Course(name=course_name, user_key=user_key)
    db.session.add(course)
    db.session.commit()

    return jsonify(course.convert_to_json()), 201

@app.route("/courses/<int:id>", methods=['GET'])
def get_course(id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=id, user_key=user_key).first_or_404()
    return jsonify(course.convert_to_json()), 200

@app.route("/courses/<int:id>", methods=['DELETE'])
def delete_course(id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=id, user_key=user_key).first_or_404()

    db.session.delete(course)
    db.session.commit()

    return jsonify({"message": f"Course '{course.name}' deleted."})

# Assessments
@app.route("/courses/<int:id>/assessments", methods=["GET"])
def get_assessments(id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=id, user_key=user_key).first_or_404()

    assessments = Assessment.query.filter_by(course_id=course.id).all()

    return jsonify([a.convert_to_json() for a in assessments]), 200


@app.route("/courses/<int:id>/assessments", methods=['POST'])
def create_assessment(id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=id, user_key=user_key).first_or_404()

    data = request.get_json(silent=True) or {}

    name = data.get('name')
    grade = data.get('grade')
    weight = data.get('weight')

    if not name or not isinstance(name, str):
        return jsonify({"error": "'name' is required and must be a string."}), 400

    if grade is None or not isinstance(grade, (int, float)):
        return jsonify({"error": "'grade' is required and must be a number."}), 400

    if weight is None or not isinstance(weight, (int, float)):
        return jsonify({"error": "'weight' is required and must be a number."}), 400

    if not (0 <= grade <= 100):
        return jsonify({"error": "'grade' must be between 0 and 100."}), 400

    if not (0 < weight <= 100):
        return jsonify({"error": "'weight' must be greater than 0 but less than or equal to 100."}), 400

    existing_weight = db.session.query(
        db.func.sum(Assessment.weight)
    ).filter_by(course_id=course.id).scalar() or 0

    if existing_weight + weight > 100:
        return jsonify({
            "error": f"Adding this assessment would exceed 100% total weight. "
                     f"Remaining weight available: {100 - existing_weight:.2f}%"
        }), 400

    assessment = Assessment(
        name=name,
        grade=grade,
        weight=weight,
        course_id=course.id
    )

    db.session.add(assessment)
    db.session.commit()

    return jsonify(assessment.convert_to_json()), 201


@app.route("/courses/<int:course_id>/assessments/<int:assessment_id>", methods=["PUT"])
def update_assessment(course_id, assessment_id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=course_id, user_key=user_key).first_or_404()

    assessment = Assessment.query.filter_by(
        id=assessment_id,
        course_id=course.id
    ).first_or_404()

    data = request.get_json(silent=True) or {}

    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"]:
            return jsonify({"error": "'name' must be a non-empty string."}), 400
        assessment.name = data["name"]

    if "grade" in data:
        if not isinstance(data["grade"], (int, float)) or not (0 <= data["grade"] <= 100):
            return jsonify({"error": "'grade' must be a number between 0 and 100."}), 400
        assessment.grade = data["grade"]

    if "weight" in data:
        if not isinstance(data["weight"], (int, float)) or not (0 < data["weight"] <= 100):
            return jsonify({"error": "'weight' must be a number between 0 and 100."}), 400

        other_weight = db.session.query(
            db.func.sum(Assessment.weight)
        ).filter(
            Assessment.course_id == course.id,
            Assessment.id != assessment_id
        ).scalar() or 0

        if other_weight + data["weight"] > 100:
            return jsonify({
                "error": f"Weight would exceed 100%. Available: {100 - other_weight:.2f}%"
            }), 400

        assessment.weight = data["weight"]

    db.session.commit()

    return jsonify(assessment.convert_to_json()), 200


@app.route("/courses/<int:course_id>/assessments/<int:assessment_id>", methods=["DELETE"])
def delete_assessment(course_id, assessment_id):
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    course = Course.query.filter_by(id=course_id, user_key=user_key).first_or_404()

    assessment = Assessment.query.filter_by(
        id=assessment_id,
        course_id=course.id
    ).first_or_404()

    db.session.delete(assessment)
    db.session.commit()

    return jsonify({"message": f"Assessment '{assessment.name}' deleted."}), 200

# Grade and GPA Calculations
def weighted_average(assessments):
    total_weight = sum(i.weight for i in assessments)
    if total_weight == 0:
        return None
    return sum(i.grade * i.weight for i in assessments) / total_weight
 
def grade_to_gpa(grade):
    if grade >= 85: return 4.0
    if grade >= 80: return 3.7
    if grade >= 77: return 3.3
    if grade >= 73: return 3.0
    if grade >= 70: return 2.7
    if grade >= 67: return 2.3
    if grade >= 63: return 2.0
    if grade >= 60: return 1.7
    if grade >= 57: return 1.3
    if grade >= 53: return 1.0
    if grade >= 50: return 0.7
    return 0.0
 
def grade_to_letter(grade):
    if grade >= 90: return "A+"
    if grade >= 85: return "A"
    if grade >= 80: return "A-"
    if grade >= 77: return "B+"
    if grade >= 73: return "B"
    if grade >= 70: return "B-"
    if grade >= 67: return "C+"
    if grade >= 63: return "C"
    if grade >= 60: return "C-"
    if grade >= 57: return "D+"
    if grade >= 53: return "D"
    if grade >= 50: return "D-"
    return "F"

@app.route("/courses/<int:id>/grade", methods=["GET"])
def get_course_grade(id):
    db.get_or_404(Course, id)
    assessments = Assessment.query.filter_by(course_id=id).all()

    if not assessments:
        return jsonify({"error": "No assessments found for this course."}), 404
 
    avg = weighted_average(assessments)
    total_weight = sum(a.weight for a in assessments)
 
    return jsonify({
        "course_id": id,
        "weighted_grade": round(avg, 2),
        "letter_grade": grade_to_letter(avg),
        "gpa_points": grade_to_gpa(avg),
        "total_weight_recorded": round(total_weight, 2),
        "weight_remaining": round(100 - total_weight, 2)
    }), 200

@app.route("/gpa", methods=["GET"])
def get_gpa():
    """Return overall GPA across all courses that have at least one assessment."""
    user_key = get_user_key()

    if not user_key:
        return jsonify({"error": "Missing user key."}), 400

    courses = Course.query.filter_by(user_key=user_key).all()
    course_results = []
 
    for course in courses:
        if not course.assessments:
            continue
        avg = weighted_average(course.assessments)
        if avg is None:
            continue
        course_results.append({
            "course_id": course.id,
            "course_name": course.name,
            "weighted_grade": round(avg, 2),
            "letter_grade": grade_to_letter(avg),
            "gpa_points": grade_to_gpa(avg)
        })
 
    if not course_results:
        return jsonify({"error": "No graded courses found."}), 404
 
    overall_gpa = sum(c["gpa_points"] for c in course_results) / len(course_results)
 
    return jsonify({
        "overall_gpa": round(overall_gpa, 2),
        "courses": course_results
    }), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all() # creates the database when app runs
    app.run(debug=True)
