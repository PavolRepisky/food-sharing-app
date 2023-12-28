import { 
  Typography, 
  useMediaQuery, 
  useTheme, 
  Container, 
  Grid, 
  Box,
  Stack
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Place as PlaceIcon,
  Web as WebIcon

} from "@mui/icons-material";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import RecentNotifications from "../../admin/components/RecentNotifications";
import CardCarousel from "../components/CardCarousel";
import events from "../../mocks/events.json";
import React, { useEffect } from "react";


const Event = () => {

  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation()

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down(450));

  const upcomingEventId = events.reduce((prev, curr) => 
    Math.abs(Date.parse(curr.date) - Date.now()) < Math.abs(Date.parse(prev.date) - Date.now()) ? curr : prev
  ).id;

  const eventId = (id === "0") ? upcomingEventId : id

  const handleEventSelect = (id: String) => {
    if (pathname.includes("donor")) {
      navigate(`/${process.env.PUBLIC_URL}/donor/event/${id}`);
    } else if (pathname.includes("receiver")) {
      navigate(`/${process.env.PUBLIC_URL}/receiver/event/${id}`);
    }

  }

  const eventData = events
    .filter((event) => event.id !== eventId)
    .map((event) => ({
      id: event.id,
      title: event.title,
      description: event.location,
      imageAlt: event.imageAlt,
      imageUrl: event.imageUrl,
      primaryActionText: t("donor.home.upcomingEvents.action"),
      primaryAction: () => handleEventSelect(event.id)
  }));

  const currentEvent = events.find((event) => event.id === eventId);

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)} ${date.toLocaleTimeString(
      i18n.language
    )}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>

      <Typography variant="h2" align="center" color="text.primary" sx={{mb: 10}}>
          { currentEvent?.title }
      </Typography>

      <Container
        component={"section"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mb: 10
        }}
      >
        <Grid container rowSpacing={3} columnSpacing={5}>
          <Grid item xs={12} sm={7}>
            <Typography variant="body1">
              { currentEvent?.description }
            </Typography>
          </Grid>

          <Grid item xs={12} sm={5}>

            <Container sx={{
              display: "flex",
              height: "100%",
              justifyContent: "space-evenly",
              flexDirection: "column",
              border: 1,
              borderRadius: 1,
              borderColor: "grey.200",
              px: 3,
              bgcolor: "background.paper"
            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                  <PlaceIcon />
                  <Typography variant="body1" sx={{ display: { xs: "none", sm: "inline" } }}>{t("events.location")}</Typography>
                </Stack>
                <Typography variant="body1" display="flex" alignItems="center">{currentEvent?.location}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                  <CalendarMonthIcon />
                  <Typography variant="body1" sx={{ display: { xs: "none", sm: "inline" } }}>{t("events.date")}</Typography>
                </Stack>  
                <Typography variant="body1" display="flex" alignItems="center">{formatDate(currentEvent?.date ?? "")}</Typography>
              </Box>
              {
                currentEvent?.webpage && <Box sx={{ display: "flex", justifyContent: "space-between" }}>              
                  <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                    <WebIcon />
                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "inline" } }}>{t("events.website")}</Typography>
                  </Stack>
                  <Typography variant="body1" display="flex" alignItems="center"><a href={currentEvent?.webpage ?? ""}>{currentEvent?.webpage}</a></Typography>
                </Box>
              }

            </Container>

          </Grid>
        </Grid>
      </Container>

      <Container
        component={"section"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mb: 10,
        }}
      >
        <Grid container rowSpacing={10} columnSpacing={3}>
          {currentEvent?.data?.map((item, index) => (
            <React.Fragment key={index}>
              {index % 2 === 1 ? (
                <>
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {t(item.heading)}
                    </Typography>
                    <Typography variant="body1">{t(item.text)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <img
                      src={item.imageUrl}
                      alt={t(item.imageAlt)}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={5}>
                    <img
                      src={item.imageUrl}
                      alt={t(item.imageAlt)}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {t(item.heading)}
                    </Typography>
                    <Typography variant="body1">{t(item.text)}</Typography>
                  </Grid>
                </>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Container>


      <Typography component="div" variant="h2" sx={{ mt: 10}}>
        {t("donor.home.upcomingEvents.title")}
      </Typography>
      
      <CardCarousel cards={eventData} cardsPerPage={xs ? 1 : 3} />
    </>
  );
};

export default Event;
