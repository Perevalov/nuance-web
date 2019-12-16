#!/bin/bash
exec gunicorn -b :5500 --access-logfile - --error-logfile - app:app
