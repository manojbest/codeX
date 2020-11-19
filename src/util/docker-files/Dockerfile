FROM openjdk:8-jdk-alpine
RUN apk add --no-cache bash
RUN apk update \
    && apk add --no-cache \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*
RUN wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F6.29.0/pmd-bin-6.29.0.zip \
    && unzip pmd-bin-6.29.0.zip \
    && alias pmd="/pmd-bin-6.29.0/bin/run.sh pmd"