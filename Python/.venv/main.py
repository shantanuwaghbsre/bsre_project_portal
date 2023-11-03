from flask import Flask
from flask_cors import CORS
from quotation_routes import blueprint as quotation_routes_blueprint

app = Flask(__name__)
CORS(app)
app.register_blueprint(quotation_routes_blueprint)



if __name__ == '__main__':
    app.run(debug=True)