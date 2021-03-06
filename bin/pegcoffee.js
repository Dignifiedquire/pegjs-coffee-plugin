// Generated by CoffeeScript 1.9.3
(function() {
  var PEG, PEGjsCoffeePlugin, abort, allowedStartRules, args, argv, exitFailure, exitSuccess, exportVar, fs, inputFile, inputStream, optimize, options, outputFile, outputStream, printHelp, printVersion, readStream;

  fs = require('fs');

  PEG = require('pegjs');

  PEGjsCoffeePlugin = require('../index');

  printVersion = function() {
    return console.log("PEG.js CoffeeScript Plugin " + PEGjsCoffeePlugin.VERSION);
  };

  printHelp = function() {
    return console.log("Usage: pegcoffee [options] [--] [<input_file>] [<output_file>]\n\nGenerates a parser from the PEG grammar specified in the <input_file> and\nwrites it to the <output_file>.\n\nIf the <output_file> is omitted, its name is generated by changing the\n<input_file> extension to \".js\". If both <input_file> and <output_file> are\nomitted, standard input and output are used.\n\nOptions:\n  -e, --export-var <variable>  name of the variable where the parser object\n                               will be stored (default: \"module.exports\")\n      --cache                  make generated parser cache results\n      --allowed-start-rules    comma separated rules to start parsing from\n      --optimize               size or speed\n      --js                     use plain JavaScript in actions\n  -v, --version                print version information and exit\n  -h, --help                   print help and exit");
  };

  exitSuccess = function() {
    return process.exit(0);
  };

  exitFailure = function() {
    return process.exit(1);
  };

  abort = function(message) {
    console.error(message);
    return exitFailure();
  };

  args = process.argv.slice(2);

  argv = require("minimist")(args, {
    string: ["export-var", "allowed-start-rules", "optimize"],
    boolean: ["cache", "version", "help", "js"],
    alias: {
      "export-var": "e",
      "version": "v",
      "help": "h"
    },
    "--": true,
    unknown: function(arg) {
      return false;
    }
  });

  readStream = function(inputStream, callback) {
    var input;
    input = "";
    inputStream.on("data", function(data) {
      return input += data;
    });
    return inputStream.on("end", function() {
      return callback(input);
    });
  };

  exportVar = "module.exports";

  options = {
    cache: false,
    output: "source"
  };

  if (args.length > 0) {
    if (argv["export-var"]) {
      exportVar = argv["export-var"];
      if (typeof exportVar !== "string") {
        abort("Missing parameter of the -e/--export-var option.");
      }
    }
    if (argv.js) {
      options.js = true;
    }
    if (argv.cache) {
      options.cache = true;
    }
    if (allowedStartRules = argv["allowed-start-rules"]) {
      if (typeof allowedStartRules !== "string") {
        abort("Missing parameter of the --allowed-start-rules option.");
      }
      options.allowedStartRules = allowedStartRules;
    }
    if (optimize = argv.optimize) {
      if (typeof optimize !== "string") {
        abort("Missing parameter of the --optimize option.");
      }
      options.optimize = optimize;
    }
    if (argv.version) {
      printVersion();
      exitSuccess();
    }
    if (argv.help) {
      printHelp();
      exitSuccess();
    }
  }

  switch (args.length) {
    case 0:
      process.stdin.resume();
      inputStream = process.stdin;
      outputStream = process.stdout;
      break;
    case 1:
    case 2:
      inputFile = args[0];
      inputStream = fs.createReadStream(inputFile);
      inputStream.on("error", function() {
        return abort("Can't read from file \"" + inputFile + "\".");
      });
      outputFile = args.length === 1 ? args[0].replace(/\.[^.]*$/, ".js") : args[1];
      outputStream = fs.createWriteStream(outputFile);
      outputStream.on("error", function() {
        return abort("Can't write to file \"" + outputFile + "\".");
      });
      break;
    default:
      abort("Too many arguments.");
  }

  readStream(inputStream, function(input) {
    var e, parser;
    if (!options.js) {
      options.plugins = [PEGjsCoffeePlugin];
    }
    try {
      parser = PEG.buildParser(input, options);
    } catch (_error) {
      e = _error;
      if ((e.line != null) && (e.column != null)) {
        abort(e.line + ":" + e.column + ":" + e.message);
      } else {
        abort(e.message);
      }
    }
    outputStream.write(exportVar + " = " + parser + ";\n");
    if (outputStream !== process.stdout) {
      return outputStream.end();
    }
  });

}).call(this);
