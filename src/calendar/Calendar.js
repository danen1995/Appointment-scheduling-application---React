import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css'
import { getConsultationsForProfessorsCalendar } from '../util/APIUtils'
import Popup from '../common/Popup';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consultations: [],
      professorsId: 1225652125495,
      calendarId: 1,
      showPopup: false
    }
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
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
              start: element.datumIVremePocetka,
              dogadjajPK: element.dogadjajPK,
              color: 'red'
            }]
          });
        } else {
          this.setState({
            consultations: [...this.state.consultations, {
              title: 'Free termin',
              start: element.datumIVremePocetka,
              end: element.datumIVremeZavrsetka,
              dogadjajPK: element.dogadjajPK,
              color: 'green'
            }]
          });
        }

      })
    }.bind(this));
  }


  didAppointmentDatePass(dogadjaj) {
    if (new Date(dogadjaj.datumIVremePocetka) < new Date()) {
      return true;
    }
    return false;
  };

  handleEventClick = (arg) => { // bind with an arrow function
    alert("EVENT CLICKED")
  }

  handleDayClick = (arg) => { // bind with an arrow function
    alert("DAY CLICKED " + arg.dateStr)
  }

  render() {
    return (
      <div>
        <FullCalendar
          dateClick={this.togglePopup.bind(this)}
          eventClick={this.handleEventClick}
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={
            this.state.consultations
          }
        />
        {this.state.showPopup ?
          <Popup
            text='Click "Close Button" to hide popup'
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
      </div>
    )
  }

}