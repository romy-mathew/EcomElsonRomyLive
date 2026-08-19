pipeline {
    agent any
    
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
                	withCredentials([
                    	string(credentialsId: 'sonarqube-token',
                        variable: 'SONAR_TOKEN')
                	]) {

                    sh """
                    ${scannerHome}/bin/sonar-scanner \
                      -Dsonar.token=$SONAR_TOKEN \
                      -Dsonar.projectKey=ecommerce-backend \
                      -Dsonar.projectName=ecommerce-backend \
                      -Dsonar.sources=. \
                      -Dsonar.projectVersion=${BUILD_NUMBER}
                    """
                }
            	    }
        	}
    	    }
	}

	stage('Quality Gate') {
    	    steps {
                timeout(time: 5, unit: 'MINUTES') {
            	    waitForQualityGate abortPipeline: true
        	}
    	    }
	}

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_REPO}:${IMAGE_TAG} .'
            }
        }

	stage('Trivy Scan') {
    	steps {
        sh '''
            trivy image \
              --severity CRITICAL \
	      --ignore-unfixed \
  	      --skip-dirs /usr/local/lib/node_modules/npm \
              --exit-code 1 \
              ${IMAGE_REPO}:${IMAGE_TAG}
        '''
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

	stage('Update Helm Image Tag') {
    	  steps {
	    sshagent(credentials: ['github-ssh']) {
              sh '''
                sed -i "s/^  tag: .*/  tag: \\"${IMAGE_TAG}\\"/" helm/ecommerce/values.yaml

                git config user.name "Jenkins"
                git config user.email "jenkins@localhost"

                git add helm/ecommerce/values.yaml
                git commit -m "Deploy image ${IMAGE_TAG}" || true

                git push origin HEAD:main
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
