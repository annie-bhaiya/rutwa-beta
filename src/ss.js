var a={
    "anime": {
        "id": "anime",
        "title": "anime tshirt"
    },
    "pizza": {
        "id": "pizza",
        "title": "pizza tshirt"
    }
}

for (const property in a) {
    console.log(`${property}: ${a[property].id}`);
  }