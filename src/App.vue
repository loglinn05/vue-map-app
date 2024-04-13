<template>
  <div class="container">
    <div class="row pb-1">
      <div class="dropdown">
        <div class="form_group">
          <input type="text" class="form_field"
                 placeholder="location" name="name"
                 id="location" ref="locationInput"
                 @input="fillLocationDropdown"
                 @keyup.enter="searchForLocation"
          />
          <label for="location" class="form_label">Location</label>
          <button class="btn-hover" title="Locate me" @click="getLocation">
            <i class="fa-solid fa-location-dot"></i>
          </button>
        </div>
        <div class="locations-list" ref="locationsDropdown">
            <span v-for="suggestion in locationSuggestions"
                  :key="suggestion.magicKey"
                  class="locations-list-item"
                  @click="chooseSuggestion">
               {{ suggestion.text ?? '' }}
            </span>
        </div>
      </div>
      <div class="helper-text">
        Press Enter to search for location
      </div>
    </div>
    <div class="row">
      <div id="map" ref="mapContainer"></div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from "pinia";
  import { useMapStore } from "../stores/map.js";

  const mapStore = useMapStore()

  const { mapContainer, locationInput, locationsDropdown, locationSuggestions } = storeToRefs(mapStore)

  const { init, getLocation, chooseSuggestion, searchForLocation, fillLocationDropdown } = mapStore

  onMounted(() => {
    init()
  })
</script>