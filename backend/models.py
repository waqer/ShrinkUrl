from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    long_url = db.Column(db.String(2048), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'long_url': self.long_url,
            'short_url': f'http://localhost:5000/{self.code}'
        }
