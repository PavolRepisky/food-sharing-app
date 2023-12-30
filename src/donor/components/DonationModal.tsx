import {
  Coffee as CoffeeIcon,
  Egg as EggIcon,
  LocalPizza as LocalPizzaIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDonations } from "../hooks/useDonations";
import { DonationItem } from "../types/DonationItem";

interface DonationModalProps {
  open: boolean;
  handleClose: () => void;
  id: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "25px",
  p: 4,
};

const DonationModal = (props: DonationModalProps) => {
  const { open, handleClose, id } = props;
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<DonationItem[]>([]);
  const theme = useTheme();
  const { data } = useDonations();
  const donation = data?.find((donation) => donation.id === id);

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)} ${date.toLocaleTimeString(
      i18n.language
    )}`;
  };

  const textFieldStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: `${theme.palette.text.primary}`,
    },
  };

  useEffect(() => {
    if (donation) {
      setItems(donation.items);
    }
  }, [donation]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
                {t("donor.editDonation.infoForm.title")}
              </Typography>

              <Box>
                <TextField
                  margin="normal"
                  fullWidth
                  id="title"
                  label={t("donor.editDonation.infoForm.donationTitle.label")}
                  placeholder={t(
                    "donor.editDonation.infoForm.donationTitle.placeholder"
                  )}
                  name="title"
                  autoFocus
                  disabled
                  sx={textFieldStyle}
                  value={donation?.title}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="location"
                  label={t("donor.editDonation.infoForm.location.label")}
                  placeholder={t(
                    "donor.editDonation.infoForm.location.placeholder"
                  )}
                  name="location"
                  disabled
                  sx={textFieldStyle}
                  value={donation?.location}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="availableFrom"
                  label={t("donor.editDonation.infoForm.from.label").slice(
                    0,
                    -1
                  )}
                  name="availableFrom"
                  disabled
                  sx={textFieldStyle}
                  value={formatDate(donation?.from ?? "")}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="availableUntil"
                  label={t("donor.editDonation.infoForm.until.label").slice(
                    0,
                    -1
                  )}
                  name="availableUbtil"
                  disabled
                  sx={textFieldStyle}
                  value={formatDate(donation?.until ?? "")}
                />

                {donation?.additionalInfo && (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="additionalInfo"
                    label={t(
                      "donor.editDonation.infoForm.additionalInfo.label"
                    )}
                    placeholder={t(
                      "donor.editDonation.infoForm.additionalInfo.placeholder"
                    )}
                    multiline={true}
                    rows={3}
                    name="additionalInfo"
                    disabled
                    sx={textFieldStyle}
                    value={donation?.additionalInfo}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
                {t("donor.editDonation.itemForm.title")}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <List>
                  {items.map((item, index) => {
                    const availableQuantity =
                      item.quantity - (item.reserved || 0);

                    const gradientPercentage =
                      (availableQuantity / item.quantity) * 100;

                    const backgroundColor = `linear-gradient(to right, ${theme.palette.background.default} ${gradientPercentage}%, ${theme.palette.primary.contrastText} ${gradientPercentage}%)`;

                    return (
                      <ListItem
                        key={index}
                        sx={{
                          background: backgroundColor,
                          borderRadius: 16,
                          border: "1px solid",
                          borderColor: "grey.200",
                          py: 0,
                          mb: 1,
                        }}
                      >
                        {item.type === "grocery" && <ShoppingBagIcon />}
                        {item.type === "preparedFood" && <LocalPizzaIcon />}
                        {item.type === "fruitsVegetables" && <EggIcon />}
                        {item.type === "beverages" && <CoffeeIcon />}
                        {item.type === "petFood" && <PetsIcon />}

                        <ListItemText
                          primary={item.name}
                          secondary={`${availableQuantity} ${item.unit} / ${item.quantity} ${item.unit}`}
                          sx={{
                            ml: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DonationModal;
