from flask import Flask
from flask_cors import CORS
from blueprints.quotation_routes import blueprint as quotation_routes_blueprint
from blueprints.consumer_routes import blueprint as consumer_routes_blueprint
from blueprints.project_routes import blueprint as project_routes_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(quotation_routes_blueprint)
app.register_blueprint(consumer_routes_blueprint)
app.register_blueprint(project_routes_blueprint)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
