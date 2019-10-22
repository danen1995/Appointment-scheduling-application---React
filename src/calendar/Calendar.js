import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css'
import { getConsultationsForProfessorsCalendar, dodajKonsultaciju } from '../util/APIUtils'
import { Modal, Button, Input, DatePicker, TimePicker } from 'antd';



export default class Calendar extends React.Component {

  calendarRef = React.createRef()

  constructor(props) {
    super(props);
    this.state = {
      consultations: [],
      professorsId: 1225652125495,
      calendarId: 1,
      showPopup: false,
      consultation: {
        numberOfScheduledCons: 0,
        startDateTime: "2019-10-08T23:00:00",
        endDateTime: "2019-10-08T00:00:00",
        eventPK: {
          "calendarId": 1
        },
        eventTypeId: { "eventTypeId": 2 },
        capacity: "12",
        place: "as"
      }
    }
  }

  componentDidMount() {
    this.loadConsultations(this.state.professorsId, this.state.calendarId);
  }

  loadConsultations(professorsId, calendarId) {
    getConsultationsForProfessorsCalendar(professorsId, calendarId).then(function (result) {
      result.forEach(element => {
        if (this.didAppointmentDatePass(element)) {
          this.setState({
            consultations: [...this.state.consultations, {
              title: 'Termin has passed',
              start: element.startDateTime,
              eventPK: element.eventPK,
              color: 'red'
            }]
          });
        } else {
          this.setState({
            consultations: [...this.state.consultations, {
              title: 'Free termin',
              start: element.startDateTime,
              end: element.endDateTime,
              eventPK: element.eventPK,
              color: 'green'
            }]
          });
        }

      })
    }.bind(this));
  }


  didAppointmentDatePass(event) {
    if (new Date(event.startDateTime) < new Date()) {
      return true;
    }
    return false;
  };

  handleEventClick = (arg) => {
    alert("EVENT CLICKED")
  }

  handleDayClick = (arg) => {
    alert("DAY CLICKED " + arg.dateStr)
  }

  handleOk = () => {
    dodajKonsultaciju(this.state.consultation).then(function (result) {
      this.setState({ showPopup: false });

    }.bind(this));
    let calendarApi = this.calendarRef.current;
    // console.log(calendarApi)
    // calendarApi.render();
    // calendarApi.addEventSource(this.state.consultations);
    // calendarApi.refetchEvents();

  };

  handleCancel = () => {
    this.setState({ showPopup: false });
  };

  showModal = () => {

    this.setState({
      showPopup: true,
    });
  };


  render() {
    return (
      <div>
        <FullCalendar ref={this.calendarRef}
          dateClick={this.showModal}
          eventClick={this.handleEventClick}
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={
            this.state.consultations
          }
        />
        <Modal
          visible={this.state.showPopup}
          title="Generate consultation"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label>
            Capacity :
            <Input placeholder="Capacity" onChange={(event) => this.setState({ consultation: { ...this.state.consultation, capacity: event.target.value } })} />
            Number of scheduled consultations :
            <Input placeholder="Number of scheduled consultations" onChange={(event) => this.setState({ consultation: { ...this.state.consultation, brojZakazanih: event.target.value } })} /> </label>
          Start date time : <br />
          <DatePicker placeholder="Start date time" onChange={(dateStr) => this.setState({ consultation: { ...this.state.consultation, endDateTime: dateStr } })} />
          <br />End date time :  <br />
          <DatePicker placeholder="End date time" onChange={(dateStr) => this.setState({ consultation: { ...this.state.consultation, startDateTime: dateStr } })} /></Modal>
        Place :
            <Input placeholder="Place " onChange={(event) => this.setState({ consultation: { ...this.state.consultation, mestoOdrzavanja: event.target.value } })} /> </div >
    )
  }
}


