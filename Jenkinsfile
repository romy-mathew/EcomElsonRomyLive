pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ecommerce-backend:${BUILD_NUMBER} .'
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }

        success {
            echo "Build succeeded: ecommerce-backend:${BUILD_NUMBER}"
        }

        failure {
            echo "Pipeline failed. Inspect the failed stage."
        }
    }
}
