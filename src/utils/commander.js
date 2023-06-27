import { program } from "commander";

program
  .option("-d, --debug", "variable para debug", false)
  .option("-m, --mode <mode>", "ambiente de trabajo", "dev")
  .option("-p, --port", "puerto de trabajo", 8080)
  .parse(process.argv);

export default program;
