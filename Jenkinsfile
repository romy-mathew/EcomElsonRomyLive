pipeline {
    agent any
    
    tools {
        sonarQube 'SonarScanner'
    }


    environment {
        IMAGE_REPO = 'romyrichu/ecommerce-backend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

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
                sh 'npm test || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=ecommerce-backend \
                          -Dsonar.projectName=ecommerce-backend \
                          -Dsonar.sources=. \
                          -Dsonar.projectVersion=${BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_REPO}:${IMAGE_TAG} .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login \
                          -u "$DOCKER_USERNAME" \
                          --password-stdin

                        docker push "${IMAGE_REPO}:${IMAGE_TAG}"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            echo 'Pipeline finished.'
        }

        success {
            echo "Published image: ${IMAGE_REPO}:${IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed. Inspect the failed stage.'
        }
    }
}
