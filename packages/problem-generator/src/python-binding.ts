import util from 'util'
import * as child from 'child_process'
const exec = util.promisify(child.exec)

// TODO: Temporary solution.

export async function computeMatrixRank (A: number[][]): Promise<number> {
  const code = `
from numpy import array
from numpy.linalg import matrix_rank
print(matrix_rank(array(${JSON.stringify(A)})))`

  const result = await exec(`${process.env.PYTHON_CMD} -c "${code}"`)

  return parseInt(result.stdout)
}
