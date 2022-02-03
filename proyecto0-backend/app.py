from datetime import datetime

from flask import Flask, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from sqlalchemy.exc import NoResultFound, IntegrityError

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

ma = Marshmallow(app)

api = Api(app)

bcrypt = Bcrypt(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    event = db.relationship("Event", backref="parent")


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "email")


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class ResourceLogin(Resource):
    def post(self):
        try:
            user = User.query.filter(User.email == request.json["email"]).one()
        except NoResultFound:
            return {"msg": 'Email or password incorrect'}, 404
        if not bcrypt.check_password_hash(user.password, request.json["password"]):
            return {"msg": 'Email or password incorrect'}, 404
        return user_schema.dump(user)


api.add_resource(ResourceLogin, "/api/login")


class ResourceUser(Resource):
    def post(self):
        hashed_password = bcrypt.generate_password_hash(request.json["password"]).decode('utf-8')
        new_user = User(email=request.json["email"], password=hashed_password)
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            return {"msg": "The email is already registered"}, 400
        return user_schema.dump(new_user)


api.add_resource(ResourceUser, "/api/user")


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    category = db.Column(db.String)
    place = db.Column(db.String)
    address = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    user = db.Column(db.String, db.ForeignKey("user.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow())

    @db.validates("category")
    def validates_category(self, key, category):
        if category != "Conferencia" and category != "Seminario" and category != "Congreso" and category != "Curso":
            raise ValueError("Invalid category")
        return category


class EventSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "category", "place", "address", "start_date", "end_date")


event_schema = EventSchema()
events_schema = EventSchema(many=True)


class ResourceEventList(Resource):
    def get(self):
        events = Event.query.filter(Event.user == request.args.get("id_user")).order_by(Event.timestamp)
        return events_schema.dump(events)

    def post(self):
        try:
            new_event = Event(name=request.json["name"], category=request.json["category"], place=request.json["place"],
                              address=request.json["address"],
                              start_date=datetime.strptime(request.json["start_date"], "%Y-%m-%dT%H:%M:%SZ"),
                              end_date=datetime.strptime(request.json["end_date"], "%Y-%m-%dT%H:%M:%SZ"),
                              user=request.json["user"])
        except ValueError as e:
            return {"msg": str(e)}, 400
        db.session.add(new_event)
        db.session.commit()
        return event_schema.dump(new_event)


class ResourceEventOne(Resource):
    def get(self, id_event):
        event = Event.query.get_or_404(id_event)
        return event_schema.dump(event)

    def put(self, id_event):
        event = Event.query.get_or_404(id_event)

        if 'name' in request.json:
            event.name = request.json['name']

        if 'category' in request.json:
            event.category = request.json['category']

        if 'place' in request.json:
            event.place = request.json['place']

        if 'address' in request.json:
            event.address = request.json['address']

        if 'start_date' in request.json:
            event.start_date = request.json['start_date']

        if 'end_date' in request.json:
            event.category = request.json['end_date']

        db.session.commit()

        return event_schema.dump(event)

    def delete(self, id_event):

        event = Event.query.get_or_404(id_event)

        db.session.delete(event)
        db.session.commit()

        return '', 204


api.add_resource(ResourceEventList, "/api/events")
api.add_resource(ResourceEventOne, "/api/events/<int:id_event>")

if __name__ == '__main__':
    app.run()
