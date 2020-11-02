# CPSC335 Algorithm Engineering - Project 2: Sort Race
###### Team Anthony: Anthony Sam (anthonysam538@csu.fullerton.edu)

## How to use the project
1. Go to https://p5js.org/download
1. Download the p5.js file
1. Download this project's .zip folder
1. Extract the .zip folder
1. Open the resulting folder and find the main.html file
1. Put the p5.js file in the same directory as the main.html file
1. Open the main.html file using an internet browser

## Introduction
This is a race between 4 sorting algorithms: insertion sort, Gold's poresort, (but I think only my professor calls it that while everyone else calls it odd-even sort,) mergesort, and quicksort. Each of the 4 sorting algorithms are given the same string to sort and each of their progress is shown one pass at a time. After all 4 algorithms finish sorting the string, the original string that they sorted is then rotated rightward, and is given to the 4 sorting algorithms for them to sort. This repeats until the string loops back around to the very first string. Then the race concludes.

## Contents
* main.html - Synthesizes all of the files together (except README.md) into an html page
* README.md - Detailed information about the project (You're reading this file right now)
* sort race.js - Contains the bulk of the programming (Requires the stuff in p5.js to work)
* style.css - Supplemental visual details used by main.html

## Sample Invocation
The string that this program sorts is "85F7D8A1593B47B". This means that everytime a sorting algorithm finishes, the resulting string will be "1345577889ABBDF". Naturally, this will be the resulting string for the rotated strings as well.