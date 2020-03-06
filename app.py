from flask import Flask, render_template, request, flash, session, url_for, redirect, make_response
from datetime import timedelta
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
app.secret_key = '12345678'


@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=5)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get_answer")
def get_answer():
    session_id = request.args.get("session_id")
    question_text = request.args.get("user_text")

    result = requests.get("http://webengineering.ins.hs-anhalt.de:41266/get_answer", params={"user_text": question_text,
                                                                          "session_id": session_id})
    result = result.json()
    return json.dumps(result)


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(Exception)
def exception_handler(e):
    return render_template('error.html'), 500


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5500)
