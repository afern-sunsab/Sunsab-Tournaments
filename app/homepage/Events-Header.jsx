const { Typography } = require("@mui/material");

function EventsHeader() {
    return (
        <div className="section">
            <div className="description section">
                <Typography variant="h2">Sunsab Tournaments </Typography>
                <Typography>As a user wanting to join a Street Fighter 2 tournament, 
                    I launch the program and see the landing page. I can log in or create an account here. 
                    I search for local tournaments and check the schedule for ones I've previously attended. 
                    Additionally, I can view any upcoming tournaments I’ve signed up for.</Typography>
            </div>
        </div>
    )
}

export default EventsHeader;