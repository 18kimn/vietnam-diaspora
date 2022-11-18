library(sf)
library(rmapshaper)
library(tidyverse)

# will make better later. hopefully

file.remove("geo.json")
st_read("world-countries") %>% 
  ms_simplify() %>% 
  st_write("geo.json", driver = "GeoJSON")
