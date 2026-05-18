from config import db

class Course(db.Model):
    """Course Table"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_key = db.Column(db.String(100), nullable=False)
    assessments = db.relationship("Assessment", backref="course", cascade="all, delete-orphan")

    def convert_to_json(self):
        """Method to convert attributes to JSON"""
        return {
            "id": self.id, 
            "name": self.name,
            "assessments": [a.convert_to_json() for a in self.assessments]
        }

class Assessment(db.Model):
    """Assessment Table"""
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    grade = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)

    def convert_to_json(self):
        """Method to convert attributes to JSON"""
        return {
            "id": self.id,
            "name": self.name,
            "course_id": self.course_id,
            "grade": self.grade,
            "weight": self.weight
        }

