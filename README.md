# Mars api

### To run the app without docker:

  - npm i
  - npm start

### To test the app without docker:

  - npm i
  - npm test

### To run the app WITH docker:

  - docker-compose up --build


### You can now curl the api endpoint:

**POST response from valid input:

```
curl --location --request POST 'http://localhost:8080/mars-input' \
--data-urlencode 'input=5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL'
```

response:

```
{
    "input": "5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL",
    "output": "1 1 E\n3 3 N LOST\n2 3 S"
}
```

**POST response from invalid input:

```
curl --location --request POST 'http://localhost:8080/mars-input' \
--data-urlencode 'input=5 3
1 1 E
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL'
```

response (showing stack trace only on development environment):

```
{
    "message": "Invalid input or input length needs to be less than 100 characters",
    "stack": "Error: Invalid input or input length needs to be less than 100 characters\n    at new InvalidInput ..."
}

```
