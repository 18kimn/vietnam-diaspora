library(sf)
library(rmapshaper)
library(tidyverse)

# will make better later. hopefully

file.remove("geo.json")
countries <- st_read("world-countries")
  

centroids <- st_centroid(countries)
vietnam <- centroids %>% filter(COUNTRY == "Vietnam")
vietnam_distance <- centroids %>% 
  mutate(dist = st_distance(geometry, vietnam)) %>% 
  arrange(dist) %>% 
  mutate(rank = 1:nrow(.)) %>% 
  select(-dist, -geometry) %>% 
  st_drop_geometry() 

countries %>% 
  ms_simplify() %>% 
  left_join(vietnam_distance, by = "COUNTRY") %>% 
  arrange(rank) %>% 
  st_write("geo.json", driver = "GeoJSON")

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

