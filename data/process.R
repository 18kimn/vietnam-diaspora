library(sf)
library(rmapshaper)
library(tidyverse)
library(jsonlite)

countries <- st_read("inputs/world-countries")
centroids <- st_centroid(countries)
vietnam <- centroids %>% filter(COUNTRY == "Vietnam")
vietnam_distance <- centroids %>% 
  mutate(dist = st_distance(geometry, vietnam)) %>% 
  arrange(dist) %>% 
  mutate(rank = 1:nrow(.)) %>% 
  select(-dist, -geometry) %>% 
  st_drop_geometry() 
countries <- countries %>% 
  left_join(vietnam_distance, by = "COUNTRY") 

xwalk <- tribble(
  ~migration_name, ~shapefile_name,
  "Cote d'Ivoire", "Ivory Coast", 
  "Central African Republic (CAR)", "Central African Republic",
  "Congo, Democratic Republic of the", "Democratic Republic of the Congo",
  "Congo, Republic of the", "Congo",
  "Eswatini", "Swaziland",
  "Micronesia", "Federated States of Micronesia",
  "North Macedonia", "Macedonia",
  "Palau", "Palau (US)",
  "Saint Kitts and Nevis", "St. Kitts and Nevis",
  "Saint Lucia", "St. Lucia",
  "Saint Vincent and the Grenadines", "St. Vincent and the Grenadines",
  "Samoa", "Western Samoa",
  "Timor-Leste", "East Timor",
  "United Arab Emirates (UAE)", "United Arab Emirates",
  "United Kingdom (UK)", "United Kingdom",
  "United States of America (USA)", "United States"
)

# want to drop England (duped with UK), 
# French Guyana (no shapes + really small pop.),
# the Vatican (not relevant?)
# Yugoslavia (ill-defined, shapes problem)
# For Yugoslavia, could just combine Serbia and Montenegro; need to ask

# need to find shapes for Hong Kong, Kosovo, Macau

# Checks for countries that are missing from one dataset but in the other
# Uses only the country "keys" of the migration dataset
# Run asynchronously, e.g. not triggered by github actions or netlify build, since
# it just calculates missing data instead of handling the integration code
migration_raw <- read_json("inputs/sheets.json")$results[[1]]$result$rawData
headers <- migration_raw[[1]]
migration_raw <- migration_raw[3:length(migration_raw)] %>% 
  map_dfr(\(wave){
    names(wave) <- headers
    as_tibble(wave)
  }) %>% 
  pivot_longer(3:last_col(), names_to = "year") %>% 
migration_keys <- tibble(COUNTRY = unique(migration_raw$Country),
                    in_migration_only = TRUE)
countries %>% 
  st_drop_geometry() %>% 
  full_join(migration_keys, by = "COUNTRY") %>% 
  as_tibble() %>% 
  mutate(
    in_shapefile_only = !is.na(rank) & (COUNTRY != "Vietnam"), 
  ) %>% 
  filter(in_migration_only | in_shapefile_only,
         !(in_migration_only & in_shapefile_only)) %>% 
  select(-rank) %>% 
  write_csv("outputs/mismatches.csv")
  
file.remove("outputs/geo.json")
countries %>%
  arrange(rank) %>% 
  full_join(xwalk, by = c("COUNTRY" = "shapefile_name")) %>% 
  mutate(COUNTRY = ifelse(!is.na(migration_name), migration_name, COUNTRY)) %>% 
  select(-migration_name) %>% 
  rename(name = COUNTRY) %>%
  st_write("outputs/geo.json", driver = "GeoJSON")

vietnam <- countries %>% 
  filter(COUNTRY == "Vietnam") %>% 
  ggplot() + 
  geom_sf(fill = "white", color = "black") + 
  theme_void() + 
  theme(
    panel.background = element_rect(fill='transparent', color=NA), #transparent panel bg
    plot.background = element_rect(fill='transparent', color=NA), #transparent plot bg
    panel.grid.major = element_blank(), #remove major gridlines
    panel.grid.minor = element_blank(), #remove minor gridlines
    legend.background = element_rect(fill='transparent'), #transparent legend bg
    legend.box.background = element_rect(fill='transparent'), #transparent legend panel
    panel.border = element_blank()
  )

ggsave("../public/favicon.svg", vietnam, bg = "transparent")

