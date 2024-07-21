import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faCheck,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Modal, Button, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const getLocalItems = () => {
  let data = localStorage.getItem("data");
  return data ? JSON.parse(data) : [];
};

const TodoList = () => {
  const [task, setTask] = useState("");
  const [list, setList] = useState(getLocalItems);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const userName = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(list));
  }, [list]);

  const checkboxHandler = (id) => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    if (!list.find((item) => item.id === id).completed) {
      setShowToast(true);
    }
  };

  const addHandler = () => {
    if (task.trim() === "") return;
    const formattedDate = formatDateTime(startDate);
    if (edit) {
      setList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, task: task, date: formattedDate } : item
        )
      );
      setEdit(false);
      setTask("");
    } else {
      const newItem = {
        id: Date.now(),
        task: task,
        completed: false,
        date: formattedDate,
      };
      setList((prevList) => [...prevList, newItem]);
      setTask("");
    }
    setShowCalendar(false);
  };

  const editHandler = (id) => {
    const itemToEdit = list.find((item) => item.id === id);
    if (!itemToEdit.completed) {
      setEdit(true);
      setId(id);
      setTask(itemToEdit.task);
      if (itemToEdit.date === "Today" || itemToEdit.date === "Tomorrow") {
        setStartDate(new Date());
      } else {
        setStartDate(new Date(itemToEdit.date));
      }
      setShowCalendar(false);
    }
  };

  const removeHandler = (id) => {
    const afterRemovedList = list.filter((item) => item.id !== id);
    setList(afterRemovedList);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("loggedin");
    navigate("/login");
  };

  const formatDateTime = (date) => {
    const now = moment();
    const selectedDate = moment(date);

    if (selectedDate.isSame(now, "day")) {
      return "Today";
    } else if (selectedDate.isSame(now.clone().add(1, "day"), "day")) {
      return "Tomorrow";
    } else {
      return selectedDate.format("ddd, MMM D");
    }
  };

  const filteredList = list.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const sortedList = filteredList.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sort === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sort === "thisWeek") {
      return moment(b.date).isSameOrAfter(moment().startOf("week")) ? -1 : 1;
    } else if (sort === "thisMonth") {
      return moment(b.date).isSameOrAfter(moment().startOf("month")) ? -1 : 1;
    }
    return 0;
  });

  const searchedList = sortedList.filter((item) =>
    item.task.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setList(getLocalItems());
  }, []);

  return (
    <>
      <div className="header d-flex align-items-center justify-content-between">
        <p className="welcome pe-5 mt-2">Welcome {userName.name}!</p>
        <button
          onClick={handleLogout}
          type="button"
          className="btn btn-info ms-3"
        >
          Logout
        </button>
      </div>

      <div className="container">
        <div className="header">My Todos</div>
        <div className="input-container">
          <input
            className="taskbar"
            type="text"
            placeholder="Enter a task here"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faCalendar}
            className="calendar-icon"
            onClick={() => setShowCalendar(true)}
          />
          <button onClick={addHandler} className="add-button px-3 py-2 ms-4">
            {edit ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </button>
        </div>
        <hr className="divider" />
        <div className="search-filter-container">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search todos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="category-container d-flex">
            <p className="category-heading me-3 ">Category</p>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
          <div className="filter-container d-flex">
            <p className="filter-heading me-3">Filter</p>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="subHeader">
          <div className="listCheckbox">Check</div>
          <div className="todoItems">Todo Item</div>
          <div className="status">Status</div>
          <div className="actions">Actions</div>
        </div>
        <div className="overflow-auto">
          {searchedList.length > 0 &&
            searchedList.map((data, index) => (
              <div className="listItem" key={data.id}>
                <div className="listCheckbox">
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={data.completed}
                    onChange={() => checkboxHandler(data.id)}
                  />
                </div>
                <div
                  className="listData"
                  style={{
                    textDecoration: data.completed ? "line-through" : "none",
                  }}
                >
                  <div className="listDate">{data.date}</div>
                  {data.task}
                </div>
                <div
                  className={`listStatus ${data.completed ? "completed" : ""}`}
                >
                  {data.completed ? "Completed" : "Pending"}
                </div>
                <div className="listActions">
                  <button
                    className="editbtn px-3 py-2"
                    onClick={() => editHandler(data.id)}
                    style={{
                      opacity: data.completed ? 0.5 : 1,
                      pointerEvents: data.completed ? "none" : "auto",
                    }}
                    disabled={data.completed}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    className="deletebtn px-3 py-2"
                    onClick={() => removeHandler(data.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          {searchedList.length === 0 && <p className="notasks pt-2">No tasks found</p>}
        </div>

        <Modal show={showCalendar} onHide={() => setShowCalendar(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="datepicker-container">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMMM d, yyyy"
                inline
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCalendar(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "#00D100",
          }}
        >
          <Toast.Body>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Yay! Task Successfully Completed
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
};

export default TodoList;
