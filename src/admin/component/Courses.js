import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  Pagination,
  Spinner,
  Table,
  Column,
  MenuItem,
  Badge,
  Modal,
  Input,
  Button,
} from 'react-rainbow-components'
import GET_COURSES from '../queries/courses'
import ErrorPage from '../../core/component/utils/ErrorPage'
import '../styles/styles.css'

const badgeStyles = { color: '#1de9b6' }

const StatusBadge = ({ value }) => (
  <Badge label={value} variant="lightest" style={badgeStyles} />
)
function CoursesList() {
  const { loading, data, error } = useQuery(GET_COURSES)
  const [activePage, setActivePage] = useState(1)
  const [isOpen, setModal] = useState(false)
  const [name, setName] = useState('')
  const itemsPerPage = 10

  function handleOnChange(event, page) {
    setActivePage(page)
  }

  if (loading) {
    return (
      <div className="rainbow-p-vertical_xx-large">
        <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
          <Spinner size="large" />
        </div>
      </div>
    )
  }

  if (error) return <ErrorPage />

  function handleOnClick(data) {
    setModal(true)
    setName(data.name)
  }
  function handleOnClose() {
    setModal(false)
  }
  function handleOnDelete() {
    // handle the deleting here
  }

  return (
    <div className="rainbow-p-bottom_xx-large">
      <Modal id="modal-1" isOpen={isOpen} onRequestClose={handleOnClose}>
        <Input
          placeholder="Enter your name"
          type="text"
          className="rainbow-p-around_medium"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button
          isLoading={false}
          label="update"
          variant="outline-brand"
          className="rainbow-m-around_medium"
        />
      </Modal>
      <Table
        keyField="_id"
        data={renderPaginatedData(data.getCourses, activePage, itemsPerPage)}
      >
        <Column header="Name" field="name" />
        <Column header="created At" field="createdAt" component={StatusBadge} />
        <Column header="created By" field="createdBy" />
        {/* <Column header="Email" field="email" /> */}
        <Column type="action">
          <MenuItem label="Edit" onClick={(e, data) => handleOnClick(data)} />
          <MenuItem
            label="Delete"
            onClick={(e, data) => handleOnDelete(data._id)}
          />
        </Column>
      </Table>
      <Pagination
        className="rainbow-m_auto"
        pages={data.getCourses.length / itemsPerPage}
        activePage={activePage}
        onChange={handleOnChange}
      />
    </div>
  )
}

function renderPaginatedData(data, activePage, itemsPerPage) {
  const lastItem = activePage * itemsPerPage
  const firstItem = lastItem - itemsPerPage
  return data.slice(firstItem, lastItem)
}
export default CoursesList