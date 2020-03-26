<template>
  <div>
        <!--    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="100%">-->
    <v-carousel
                cycle
                :height="screenHeight"
                hide-delimiter-background
                show-arrows-on-hover
                fluid
    >
      <v-carousel-item
                    v-for="(item,i) in imageUrls"
                    :key="i"
                    :src="item.src">
        <v-overlay absolute
                           opacity="0.8"
        >
        </v-overlay>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },

    data: () => ({
      imageUrls: [
        {
            src: require("@/assets/images/login/1.jpg"),
        },
        {
            src: require("@/assets/images/login/2.jpg"),
        },
        {
            src: require("@/assets/images/login/3.jpg"),
        },
        {
            src: require("@/assets/images/login/4.jpg"),
        },
        {
            src: require("@/assets/images/login/5.jpg"),
        }
    ],
    }),
  }
</script>
