import util from 'util'
import * as child from 'child_process'
import { z } from 'zod'
const exec = util.promisify(child.exec)

// TODO: Temporary solution.

const pythonCommandDefault = '/usr/bin/python'

const pythonCommand = z.string().min(1).default(pythonCommandDefault).parse(process.env.PYTHON_CMD)

export async function computeMatrixRank (A: number[][]): Promise<number> {
  const code = `
from numpy import array
from numpy.linalg import matrix_rank
print(matrix_rank(array(${JSON.stringify(A)})))`

  const result = await exec(`${pythonCommand} -c "${code}"`)

  return parseInt(result.stdout)
}
