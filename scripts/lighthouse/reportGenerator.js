const fs = require('fs-extra');
const htmlReport = require('./consolidateReport');
const Logger = require('../utils/logger');

const consolidateJsonReport = 'performance_reports/performance_report.json';
let numberOfTestsAboveAvg = 0;
let numberOfTestsBelowAvg = 0;
let numberOfTestsEqualToAvg = 0;


const addReportData = (jsonOutput, fileUrl) => {
  const reportResult = {
    testName: fileUrl,
    perfScore: jsonOutput.categories.performance.score * 100,
    reportLink: `${process.cwd()}/performance_reports/html/${fileUrl}`,
  };

  let jsonArray = [];
  if (fs.existsSync(consolidateJsonReport)) {
    jsonArray = JSON.parse(fs.readFileSync(consolidateJsonReport));
  }
  jsonArray.push(reportResult);
  fs.writeFileSync(consolidateJsonReport, JSON.stringify(jsonArray));
};

const generateReport = (consolidateHtmlReport) => {
  if (fs.existsSync(consolidateJsonReport)) {
    const reportResults = JSON.parse(fs.readFileSync(consolidateJsonReport));
    const tableRows = reportResults.map((result) => {
      let perfScoreClass;
      if (result.perfScore >= 90 ) {
        perfScoreClass = 'perf_score_pass';
        numberOfTestsAboveAvg += 1;
      } else if (result.perfScore >= 70) {
        perfScoreClass = 'perf_score_avg';
        numberOfTestsEqualToAvg += 1;
      } else {
        perfScoreClass = 'perf_score_fail';
        numberOfTestsBelowAvg += 1;
      }
      const rows = `<tr>
        <td>${result.testName}</td>
        <td class=${perfScoreClass}><a target=${result.reportLink} href=${result.reportLink}>${result.perfScore}</a></td>
        </tr>`;
      return [rows];
    });
    try {
      fs.writeFileSync(consolidateHtmlReport, htmlReport({ numberOfTestsAboveAvg, numberOfTestsBelowAvg, numberOfTestsEqualToAvg }, tableRows.join('')));
      fs.removeSync(consolidateJsonReport);
    } catch (e) {
      Logger.error('ERROR While generating Lighthouse Consolidate Report :',e);
    }
  }
};

module.exports = {
  addReportData,
  generateReport,
};