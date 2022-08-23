#!/usr/bin/env node

const yargs = require("yargs");
const _ = require("underscore");
const stringSimilarity = require("string-similarity");

const input_json = require('../input.json');


var output = new Object()

// Step 1

output["total_task_hours"] = _.reduce(input_json.all_tasks, function(memo, num) { return memo + num.task_time; }, 0);

// Step 2

output["remaining_hours"] = _.reduce(_.pluck(input_json.all_tasks.filter(item => item.task_status != "complete"), "task_time"), function(memo, num) { return memo + num; }, 0)

// Step 3
output["percentage_complete"] = output["remaining_hours"] / output["total_task_hours"]

// Step 4
output["commited_design_capacity"] = roundNearest100(input_json.commited_design_capacity)

// Step 5

output["hours_per_day"] = roundNearest100(output["commited_design_capacity"] / 8) * 100

// Step 6

output["total_days"] = roundNearest100(output["total_task_hours"] / output["hours_per_day"])


// Step 7
output["total_weeks"] = roundNearest100(output["total_days"] / 5)


// Step 8

var est_sizing = input_json.sizing_values.filter(item => { return item.days_min >= output["total_days"] && item.days_max <= output["total_days"] });


output["est_sizing"] = _.first(est_sizing).label

// Step 9

output["days_remaining"] = roundNearest100(output["remaining_hours"] / output["hours_per_day"])

// Step 10

output["weeks_remaining"] = roundNearest100(output["days_remaining"] / 5)

// Step 11

output["start_date"] = input_json.start_date

// Step 12

output["est_completion_date"] = input_json.start_date

console.log(output)

function roundNearest100(num) {
    return parseFloat((Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2))
}
