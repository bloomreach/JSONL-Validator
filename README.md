# JSONL Tester
paul.edwards@bloomreach.com

A simple utility to parse very large JSONL files and find if each line is valid JSON as well as confirming that it meets the minimum required spec for Bloomreach JSONL.

# Installation

1. Install a recent version of node.js
2. download the repo
3. npm install

# Running the tool

1. edit index.js and replace the inputFile variable with the location of the file you want to parse
2. node . > output.txt

The utility will parse the file and stream any errors too: output.txt. The errors will contain the line number and a failure message.

Note: I have included a sample JSONL file with a bug in it that you can play with as a point of reference (testfile.jsonl)

# Things that might trip you up:

1. Newlines in your JSON.
2. Commas at the end of the line (these should not be in the JSONL file).
3.  The utility currently checks for 'op' and 'path' keys in each line of JSONL as this is the basic specification.
4.  The format of JSONL is different if you are directly embedding the json into the API request rather than uploading it as a referenced file (with direct embedding, the JSONL is an array and therefore has commas at the end of each line and is surrounded by square brackets).

# Documentation

https://documentation.bloomreach.com/developers/search-and-merchandising/data-delivery/api/product/api-catalog-data-delivery.html