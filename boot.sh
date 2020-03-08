#!/bin/bash
exec gunicorn -b :41210 --access-logfile - --error-logfile - app:app
