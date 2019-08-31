workflow "Lint, Build and Deploy" {
  on = "push"
  resolves = [
    "Lint",
    "Build",
    "Deploy to Heroku",
  ]
}

action = "Install Deps" {
  args = "install"
}

action = "Lint" {
  needs = ["Install Deps"]
  args = "run lint"
}

action = "Build" {
  needs =  ["Lint"]
  args = "run build"
}

action "login" {
  needs = ["Build"]
  uses = "actions/heroku@master"
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "push" {
  uses = "actions/heroku@master"
  needs = "login"
  args = "container:push -a express-web-app web"
  secrets = ["HEROKU_API_KEY"]
}

action "release" {
  uses = "actions/heroku@master"
  needs = "push"
  args = "container:release -a express-web-app web"
  secrets = ["HEROKU_API_KEY"]
}
