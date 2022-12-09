library(sf)
library(rmapshaper)
library(tidyverse)

# will make better later. hopefully

file.remove("geo.json")
countries <- st_read("world-countries") %>% 
  ms_simplify()

st_write(countries, "geo.json", driver = "GeoJSON")

vietnam <- countries %>% 
  filter(COUNTRY == "Vietnam") %>% 
  ggplot() + 
  geom_sf(fill = "white") + 
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

ggsave("favicon.svg", vietnam, bg = "transparent")
