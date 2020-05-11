import React from 'react'
import { ReactComponent as Checked } from '../assets/images/checked.svg'
import OctiIcon, { IssueOpened } from '@primer/octicons-react'

type Props = {
  children?: React.ReactNode
  fail?: boolean
  success?: boolean
  text?: string
  classes?: string
  title: string
}

const Card: React.FC<Props> = props => {
  const classes = `${props.classes ||
    'col-sm-8 col-md-7 col-lg-6 col-xl-6 m-auto px-md-5 border-0'}`
  return (
    <div className="row mt-5">
      <div className={`card shadow-sm ${classes}`}>
        <div className="card-body text-center pt-5 pb-5">
          {props.success && (
            <Checked className="mb-4" width="100px" height="100px" />
          )}
          {props.fail && (
            <OctiIcon
              icon={IssueOpened}
              className="mb-4 text-danger"
              height={100}
              width={100}
            />
          )}
          <h1 className="card-title h2 font-weight-bold mb-5">{props.title}</h1>
          <p className="card-text">{props.text}</p>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Card
