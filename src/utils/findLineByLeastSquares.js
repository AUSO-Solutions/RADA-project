export function findLineByLeastSquares(values_x, values_y) {
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    /*
     * The above is just for quick access, makes the program faster
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length !== values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Above and below cover edge cases
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    // console.log(values_y)
    for (let i = 0; i< values_length; i++) {
        x = parseFloat(values_x[i]);
        y = parseFloat(values_y[i]);
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;
    }
// console.log({xx_sum,xy_sum,})
    /*
     * Calculate m and b for the line equation:
     * y = x * m + b
     */
    var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    //  console.log(count,xy_sum,x_sum,y_sum,'--',(count*xy_sum - x_sum*y_sum))
    var b = (y_sum/count) - (m*x_sum)/count;
// console.log({y_sum,y})
    /*
     * We then return the x and y data points according to our fit
     */
    var result_values_x = [];
    var result_values_y = [];

    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        // console.log(x, m, b)
        result_values_x.push(x);
        result_values_y.push(y);
    }
// console.log({result_values_y})
    return [result_values_x, result_values_y];
}