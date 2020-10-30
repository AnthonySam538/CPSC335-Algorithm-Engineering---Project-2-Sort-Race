/* Author: Anthony Sam (anthonysam538@csu.fullerton.edu)
This is the javascript file. */

function setup() // p5.js setup function | This will be called once and only once
{
    /* stringToBeSorted will be used as an original copy of the string 
    while the other four strings will be gradually modified by their 
    respective sorting algorithms. When the other four strings are fully 
    sorted, then stringToBeSorted will be changed a bit so that the four 
    sorting algorithms have a new string to sort. 
    insertionSortHasFinished, poresortHasFinished, and 
    mergesortHasFinished are used to determine if their respective sorting 
    algorithm should be called in draw(). 
    quicksort uses something different: quicksortIntervals. It's an array
    of integers where numbers are pushed and shifted two numbers at a
    time. Each pair of numbers is a pair of indexes that represent
    endpoints of a section of the string that should be quicksorted. */
    stringToBeSorted = insertionSortString = poresortString = mergesortString = quicksortString = "85F7D8A1593B47B";
    insertionSortHasFinished = poresortHasFinished = mergesortHasFinished = false;
    quicksortIntervals = [0, stringToBeSorted.length - 1];

    /* currentRow is used for printing out the results in the specified 
    row. (Note that it starts at row 1 because the algorithm names will be 
    printed at row 0)
    When numberOfIterations is equal to stringToBeSorted.length, the 
    program will come to a complete stop.
    Insertion sort and mergesort use numberOfPasses in their own unique 
    ways, which will be described. */
    currentRow = 1;
    numberOfIterations = 0;
    numberOfPasses = 0;
    
    grid = { width: 66, height: stringToBeSorted.length * (stringToBeSorted.length + 1), cellSize: 20 }; // 66 cells wide, a certain amount of cells tall, with each cell being a 20px×20px square

    /* The following variables are mainly used when displaying 
    insertionSortString, poresortString, mergeSortString, and 
    quicksortString. They help to evenly space out the 4 strings in the 
    canvas. By using the width of the grid, the length of the strings, and 
    the amount of sorting algorithms in this program, we can roughly 
    determine how many empty cells should be between each string. */
    // insertionSortColumn = 0 * grid.cellSize; // note that insertionSortColumn simply evaluates to 0
    poresortColumn = Math.round(stringToBeSorted.length + (grid.width - stringToBeSorted.length * 4) / 3); // amount of cells inbetween a pair of strings = (grid.width-string.length*4)/(4-1) ||4 is the amount of sorting algorithms||
    mergesortColumn = Math.round(grid.width - 2 * stringToBeSorted.length - (grid.width - stringToBeSorted.length * 4) / 3);
    quicksortColumn = grid.width - stringToBeSorted.length;

    // Create the canvas by using the grid object
    createCanvas(grid.width * grid.cellSize, grid.height * grid.cellSize); // use the grid object to create a canvas

    // Display the names of the 4 sorting algorithms as well as the string that they will sort just below
    fill(255);
    textSize(22);
    textAlign(LEFT, TOP); // when defining the location of text, we use the northwest corner of the text box
    text("Insertion Sort",0,0);
    text("Gold's Poresort", poresortColumn * grid.cellSize, 0);
    text("Mergesort", mergesortColumn * grid.cellSize, 0);
    text("Quicksort", quicksortColumn * grid.cellSize, 0);
    displayInsertionSortString();
    displayPoresortString();
    displayMergesortString();
    displayQuicksortString();
    
    frameRate(2); // draw() will be called 2 times per second
}

function draw() // p5.js draw function | This will be continuously called
{
    ++currentRow; // move on to the next row

    // if all sorting algorithms are done
    if (insertionSortHasFinished && poresortHasFinished && mergesortHasFinished && !quicksortIntervals.length)
    {
        // if there are still more strings to be sorted
        if (++numberOfIterations < stringToBeSorted.length)
        {
            stringToBeSorted = insertionSortString = poresortString = mergesortString = quicksortString = rotateRightward(stringToBeSorted);
            insertionSortHasFinished = poresortHasFinished = mergesortHasFinished = false;
            quicksortIntervals = [0, stringToBeSorted.length - 1];
            numberOfPasses = 0;

            ++currentRow; // skip a row
            // display the new string in each of the four columns
            displayInsertionSortString();
            displayPoresortString();
            displayMergesortString();
            displayQuicksortString();

            return; // get out of the draw() function so that the algorithms don't get a pass through their string immediately after displaying their initial string
        }
        // if there are no more strings to be sorted
        else
            noLoop(); // stop calling the draw() function
    }

    // if a sorting algorithm has not finished, then perform a pass and display the result
    if(!insertionSortHasFinished)
    {
        insertionSort();
        displayInsertionSortString();
    }
    if(!poresortHasFinished)
    {
        poresort();
        displayPoresortString();
    }
    if (!mergesortHasFinished)
    {
        mergesort();
        displayMergesortString();
    }
    if (quicksortIntervals.length)
    {
        quicksort();
        displayQuicksortString();
    }
    
    ++numberOfPasses; // all algorithms (minus any that are already finished) have now gotten a pass
}

/* During insertion sort, simply put, there is a sorted list on the left, 
and the rest of the elements are on the right. Insertion sort uses 
numberOfPasses to determine which element will be inserted into the sorted 
section. To insert the selected element into the sorted section of the 
list, the selected element will continously look to the element on its 
left. If selected element is smaller, then the two elements will switch 
places. On the other hand, if the selected element is larger, or if there 
simply does not exist an element to its left, then the selected element 
stops moving. Insertion sort finishes if and only if the last element in 
the string has moved to its final spot in the string. Note that this means 
that the amount of passes insertion sort will make can be exactly 
predicted by looking at the size of the list. This is used to set the 
height of the canvas, as insertion sort always requires the most amount of 
passes compared to the other sorting algorithms here. (Though, if the 
string is only 2 characters long, then there will be a tie between which 
algorithms makes the most amount of passes.) */
function insertionSort()
{
    let index = numberOfPasses + 1; // The " + 1" at the end causes this function to start at the second character, since the first character wouldn't have anywhere to move anyway. However, this does mean that it can't sort a 1-character string.

    if (index == stringToBeSorted.length - 1)
        insertionSortHasFinished = true; // this technically should be "insertionSortWillBeFinished = true;" since the last element hasn't been moved to its place yet, but whatever

    while (index > 0)
    {
        // if the character we're moving is smaller than the character to its left, have them swap places
        if (insertionSortString[index] < insertionSortString[index - 1])
        {
            insertionSortString = swapCharacters(insertionSortString, index - 1, index);
            --index; // update the location of the character we're moving
        }
        // if the character we're moving is not smaller than the character to its left, then break out of the while loop; we've done all we can for it for now
        else
            break;
    }
}

/* Gold's poresort works by first swapping even pairs, and then swapping 
odd pairs. (Though I'm sure if you swap odd pairs before even pairs, 
you'll still get a sorted string.) At the very beginning of a pass, we set 
poresortHasFinished to true. Then when we sort the even pairs, we check 
each pair of elements starting with the first and second elements in the 
string. When we sort the odd pairs, we check each pair of elements 
starting with the second and third elements in the string. Whenever a swap 
has to be made, poresortHasFinished gets set back to false. So Gold's 
poresort finishes if and only if a pass through the string is made without 
any swaps, as indicated by poresortHasFinished remaining true. */
function poresort()
{
    // Before we begin, assume that the string is currently sorted
    poresortHasFinished = true;

    // iterate through each even pair in the string
    for (let index = 0; index + 1 < stringToBeSorted.length; index += 2)
    {
        // If we need to swap characters, then swap characters. And indicate that another iteration of poresort may be necessary.
        if (poresortString[index] > poresortString[index + 1])
        {
            poresortString = swapCharacters(poresortString, index, index + 1);
            poresortHasFinished = false;
        }
    }
    
    // iterate through each odd pair in the string
    for (let index = 1; index + 1 < stringToBeSorted.length; index += 2)
    {
        // If we need to swap characters, then swap characters. And indicate that another iteration of poresort may be necessary.
        if (poresortString[index] > poresortString[index + 1])
        {
            poresortString = swapCharacters(poresortString, index, index + 1);
            poresortHasFinished = false;
        }
    }
}

/* Mergesort works by iterating through each pair of sublists in the 
string. The size of the sublists is determined by numberOfPasses. When 
checking on a pair of sublists, the leftmost value of the sublists are 
compared, where the smaller value gets popped and added to the updated mergesort string 
string. Elements will keep getting popped from sublists and added to the 
updated mergesort string until both sublists are empty. Then the old string is
replaced by the updated mergesort string. Also, if there are an odd amount of
sublists, than the last sublist will just remain in place. Mergesort 
finishes if and only if the size of the next sublists is large enough for 
just one sublist to contain the entire string. */
function mergesort()
{
    // initialize some variables
    let currentIndexOfFirstSublist = currentIndexOfSecondSublist = endOfFirstSublist = endOfSecondSublist = 0;
    let updatedMergesortString = "";
    // Note: sublistSize isn't explicitly defined here, but it is 2 ** numberOfPasses. So 2 * 2 ** numberOfPasses is the total size of two sublists

    for (let index = 0; index < stringToBeSorted.length; index += 2 * 2 ** numberOfPasses)
    {
        // set the current indexes of the two sublists to the start of their list
        currentIndexOfFirstSublist = index;
        currentIndexOfSecondSublist = index + 2 ** numberOfPasses;
        // if the first sublist doesn't have a second sublist to compare characters against, then simply append the characters in the first sublist to the updated mergesort string
        if (currentIndexOfSecondSublist >= stringToBeSorted.length)
        {
            while (currentIndexOfFirstSublist < stringToBeSorted.length)
                updatedMergesortString += mergesortString[currentIndexOfFirstSublist++];
            break;
        }

        // set the end of the two sublists
        endOfFirstSublist = currentIndexOfSecondSublist - 1;
        if (currentIndexOfSecondSublist + 2 ** numberOfPasses - 1 < stringToBeSorted.length) // if the end of the second sublist is not out-of-bounds, then don't change it
            endOfSecondSublist = currentIndexOfSecondSublist + 2 ** numberOfPasses - 1;
        else // otherwise, if the end of the second sublist is out-of-bounds, then set the end of the second sublist to the very end of the string
            endOfSecondSublist = stringToBeSorted.length - 1;
        
        // while both the first sublist isn't depleted and the second sublist isn't depleted
        while (currentIndexOfFirstSublist <= endOfFirstSublist && currentIndexOfSecondSublist <= endOfSecondSublist)
        {
            // if the current character in the first sublist is smaller, add that to the updated mergesort string
            if(mergesortString[currentIndexOfFirstSublist] <= mergesortString[currentIndexOfSecondSublist])
            {
                updatedMergesortString += mergesortString[currentIndexOfFirstSublist++]; // after this statement is executed, the "++" operator updates the first sublist's current character (the "++" operator is used like this a few more times)

                // if popping that character depleted the first sublist
                if (currentIndexOfFirstSublist > endOfFirstSublist)
                {
                    // append what's left of the second sublist to the updated mergesort string
                    while(currentIndexOfSecondSublist <= endOfSecondSublist)
                        updatedMergesortString += mergesortString[currentIndexOfSecondSublist++];
                }
            }
            // if the current character in the second sublist is smaller, add that to the updated mergesort string
            else
            {
                updatedMergesortString += mergesortString[currentIndexOfSecondSublist++];
                
                // if popping that character depleted the second sublist
                if (currentIndexOfSecondSublist > endOfSecondSublist)
                {
                    // append what's left of the second sublist to the updated mergesort string
                    while(currentIndexOfFirstSublist <= endOfFirstSublist)
                        updatedMergesortString += mergesortString[currentIndexOfFirstSublist++];
                }
            }
        }
    }

    // replace the old string with the updated mergesort string
    mergesortString = updatedMergesortString;

    // check if we're done
    if(2 * 2 ** numberOfPasses >= stringToBeSorted.length) // if the next sublist size will be larger than the string itself
        mergesortHasFinished = true;
}

/* Quicksort, like mergesort, (and technically Gold's poresort as well I 
think) is another divide-and-conquer sorting algorithm. But the way that 
quicksort works is by having two variables, i and j swap around their 
elements based on a pivot variable, where the value of pivot is the value 
of the first element in the list. (Though other implementations may use a 
randomly chosen element for pivot.) i will move rightwards, swapping over 
elements that are larger than pivot. j will move leftwards, swapping over 
elements that are smaller than pivot. At some point, i and j will pass 
each other. This is pivot's cue to swap places with j. This causes the 
pivot to be put into its final place in the list; all elements to the left 
of pivot will be less than pivot and all elements to the right of pivot 
will be greater than or equal to pivot. So, ultimately, we were just 
trying to find pivot's place in the list. Now, the location of pivot 
creates two sublists: one to the left of pivot's final location, and one 
to the right of pivot's final location. Then, quicksort is performed on 
these sublists, which will probably generate more sublists in turn. This 
process will continue until the generated sublists become so small (i.e. 
the sublist contains less than 2 elements) that quicksort is not needed 
for them, so eventually, there will be no more sublists to sort, allowing 
this algorithm to finish execution. I will say though, it would probably 
be easier to just watch a video of quicksort in action, as opposed to 
simply reading words: https://youtu.be/7h1s2SojIRw?t=262. Although his 
implementation of quicksort is recursive, unlike mine, which is iterative, 
(you won't see quicksort() make any calls to quicksort() here) the general 
idea is still the same. */
function quicksort()
{
    // iterate through each interval we have in the quicksortIntervals array, saving any and all newly-generated intervals for another pass
    for (let intervals = quicksortIntervals.length / 2; intervals > 0; --intervals)
    {
        // beginning and end are constant variables and are used when generating further sublists
        const beginning = i = quicksortIntervals.shift(); // beginning is also the pivot in this case
        const end = j = quicksortIntervals.shift();
        
        do
        {
            ++i; // step to the right (incrementing i before doing anything will cause i to first start at the second character (the character after pivot) similar to insertion sort)

            // if i has passed j, then swap pivot and j, and generate the two sublists
            if (i > j)
            {
                quicksortString = swapCharacters(quicksortString, beginning, j);
                break; // break out of the do-while loop so we can get to generating the sublists
            }
            // if i has found a large character to swap over, then pass control over to j
            if (quicksortString[i] > quicksortString[beginning])
            {
                while (true) // while j is in bounds
                {
                    // if j has passed i, then swap pivot and j, and generate the two sublists
                    if(j < i)
                    {
                        quicksortString = swapCharacters(quicksortString, beginning, j);
                        i = end + 1; // this is so we can also get out of the do-while loop
                        break; // break out of the while loop so we can get out of the do-while loop so we can get to generating the sublists
                    }
                    // if j has found a small character to swap over, then swap i and j, and pass control back over to i
                    if (quicksortString[j] < quicksortString[beginning])
                    {
                        quicksortString = swapCharacters(quicksortString, i, j);
                        break; // break out of the while loop so we can pass control back over to i
                    }
                    --j; // step to the left
                }
            }
        } while (i <= end); // while i is in bounds (The only reason why this isn't true as well is because I need a way to break out of this do-while loop from inside a nested while loop. I suppose I could try using labels...)

        // if the left sublist has more than 1 character, push it on the quicksortIntervals queue
        if (beginning < j - 1)
        {
            quicksortIntervals.push(beginning);
            quicksortIntervals.push(j - 1);
        }

        // if the right sublist has more than 1 character, push it on the quicksortIntervals queue
        if (j + 1 < end)
        {
            quicksortIntervals.push(j + 1);
            quicksortIntervals.push(end);
        }
    }
}

/* Displays the current progress of insertion sort in the leftmost column 
in the canvas. */
function displayInsertionSortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(insertionSortString[index], index * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of Gold's poresort in the second column 
to the left in the canvas. */
function displayPoresortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(poresortString[index], (poresortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of mergesort in the second column to the 
right in the canvas. */
function displayMergesortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(mergesortString[index], (mergesortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}

/* Displays the current progress of quicksort in the rightmost column in 
the canvas. */
function displayQuicksortString()
{
    for (let index = 0; index < stringToBeSorted.length; ++index)
        text(quicksortString[index], (quicksortColumn + index) * grid.cellSize, currentRow * grid.cellSize);
}

/* After a couple minutes of headscratching, I found out that strings in 
javascript are immutable, which means that the following code: 

myString = "ABC";
myString[0] = "3";

will not change the "A" in myString to be "3". However, while I can't 
change the characters in a string, I am allowed to replace a string with a 
different one. So, to modify a string, I have to create a function that 
will return a modified version of that string, so that I can replace that 
string with the returned string. */
/* This function will swap the characters at indexes a and b. If a and b 
both refer to the same spot in the string, then myString will simply be 
returned as-is. */
function swapCharacters(myString, a, b)
{
    if(a == b) return myString; // this is necessary, because otherwise, the returned string will be an extra character long, which really throws the program off

    return myString.substring(0, a) + myString[b] + myString.substring(a + 1, b) + myString[a] + myString.substring(b + 1); // left of a + b + inbetween a and b + a + right of b
}

/* This function will create a new string out of myString by taking the 
last character of myString, and moving it to the beginning of myString. */
function rotateRightward(myString)
{
    return myString[myString.length - 1] + myString.substring(0, myString.length - 1);
}