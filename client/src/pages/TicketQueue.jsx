import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextTicket,
  fetchTickets,
  updateTicketStatus,
} from "../store/reducers/ticketSlice";

const TicketQueue = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.tickets.list);
  const [statusFilter, setStatusFilter] = useState("waiting");

  useEffect(() => {
    dispatch(fetchTickets(statusFilter));
  }, [dispatch, statusFilter]);

  const handleStatusChange = (ticketId, newStatus) => {
    dispatch(updateTicketStatus({ id: ticketId, status: newStatus }));
  };

  const handleNextPatient = () => {
    dispatch(fetchNextTicket());
  };

  return (
    <div>
      <h2>Patient Queue</h2>
      <label>
        Filter by Status:
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="waiting">Waiting</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button onClick={handleNextPatient}>Call Next Patient</button>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <p>رقم التذكرة: {ticket.ticketNumber}</p>
            <p>الحالة: {ticket.status}</p>
            <button
              onClick={() => handleStatusChange(ticket._id, "in-progress")}
            >
              In Progress
            </button>
            <button
              className="bg-green-400"
              onClick={() => handleStatusChange(ticket._id, "completed")}
            >
              Completed
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketQueue;
