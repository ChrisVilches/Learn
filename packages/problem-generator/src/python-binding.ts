import util from 'util'
import * as child from 'child_process'
const exec = util.promisify(child.exec)

// TODO: Explain that this is temporary and not a very efficient solution.

export async function computeMatrixRank (A: number[][]): Promise<number> {
  const code = `
from numpy import array
from numpy.linalg import matrix_rank
print(matrix_rank(array(${JSON.stringify(A)})))`

  // TODO: the `python3` command should be configurable somehow (maybe via env variables)
  const result = await exec(`python3 -c "${code}"`)

  // TODO: Handle stderr
  return parseInt(result.stdout)
}
