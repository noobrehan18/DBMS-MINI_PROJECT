function mapResult(result) {
  const cols = result.metaData.map(c => c.name);
  return result.rows.map(row => Object.fromEntries(cols.map((c, i) => [c, row[i]])));
}
module.exports = { mapResult };

