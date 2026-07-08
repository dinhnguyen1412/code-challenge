// Method 1: Using loop
var sum_to_n_1 = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Method 2: Using recursion
var sum_to_n_2 = function(n) {
    if (n <= 1) return n;
    return n + sum_to_n_c(n - 1);
};

// Method 3: Using the Gauss formula
var sum_to_n_3 = function(n) {
    return n * (n + 1) / 2;
};
