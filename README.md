# Management Tools Project

## Overview

This project provides configuration files and customizations for managing and setting up various tools, particularly focused on custom CSS and JavaScript to enhance user interfaces like Heimdall and Homer. Additionally, it leverages Docker Compose to manage multiple services such as Portainer, Glances, and Heimdall.

## Project Structure

- `.dockerignore` - Defines files and directories to ignore when building Docker images.
- `.gitignore` - Specifies files to ignore in Git version control.
- `Heimdall Custom CSS.css` - Custom CSS to style the Heimdall dashboard.
- `Heimdall CustomJs, Homer Look Like.js` - JavaScript to make Heimdall look like Homer.
- `docker-compose.yml` - A Docker Compose file to set up and manage the required containers for this project.

## Getting Started

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd management-tools-master
   ```

2. Start the services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

   This will pull the necessary Docker images and start the services as defined in the `docker-compose.yml`.

3. Access the services via your web browser:
   - **Portainer**: `http://localhost:8000` or `https://localhost:9443`
   - **Glances**: `http://localhost:61208`
   - **Heimdall**: `http://localhost` (HTTP on port 80) or `https://localhost` (HTTPS on port 443)

## Docker Services

This project uses Docker Compose to set up and run the following services:

- **Portainer**: A UI for managing Docker containers.
  - Accessible at `http://localhost:8000` or `https://localhost:9443`.
  - Volumes:
    - `${MOUNT_POINT}/portainer_data:/data`
    - `/var/run/docker.sock:/var/run/docker.sock`
  - Environment Variables:
    - `PUID=1000`
    - `PGID=1000`
    - `TZ=Europe/London`

- **Glances**: A web-based monitoring tool.
  - Accessible at `http://localhost:61208`.
  - Volumes:
    - `/var/run/docker.sock:/var/run/docker.sock:ro`
    - `${MOUNT_POINT}/glances:/glances/conf`
  - Environment Variables:
    - `TZ=Europe/Paris`
    - `GLANCES_OPT=--webserver`

- **Heimdall**: A dashboard for organizing and launching web applications.
  - Accessible at `http://localhost` (port 80) or `https://localhost` (port 443).
  - Volumes:
    - `${MOUNT_POINT}/heimdall:/config`
  - Environment Variables:
    - `PUID=1000`
    - `PGID=1000`
    - `TZ=Europe/London`

Ensure that the `MOUNT_POINT` environment variable is set before running Docker Compose. This variable defines where to store the data on your local machine.

## Customizations

- **Custom CSS:** The file `Heimdall Custom CSS.css` is used to apply a unique style to the Heimdall dashboard.
- **Custom JS:** The `Heimdall CustomJs, Homer Look Like.js` adds JavaScript modifications to make Heimdall resemble the Homer dashboard.

## Contributing

Feel free to submit issues or pull requests if you'd like to contribute. Suggestions for improvements or new features are always welcome!

## License

This project is licensed under the MIT License.
