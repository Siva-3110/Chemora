#!/usr/bin/env bash
# Start script for Render

gunicorn equipment_api.wsgi:application --bind 0.0.0.0:$PORT