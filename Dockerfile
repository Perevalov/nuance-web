FROM python:3.6.6-slim

WORKDIR /home/nuance-web

COPY requirements.txt ./

# Install required libs
RUN pip install --upgrade pip -r requirements.txt; exit 0

# Копирование файлов проекта
COPY static static
COPY templates templates
COPY app.py boot.sh ./

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


RUN chmod +x boot.sh

EXPOSE 5500
ENTRYPOINT ["./boot.sh"]
