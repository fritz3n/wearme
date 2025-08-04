#include "microphone.h"
#include <driver/i2s.h>
#include <Arduino.h>

// Define I2S pins
#define I2S_WS_PIN 22  // Word Select
#define I2S_SCK_PIN 26 // Serial Clock
#define I2S_SD_PIN 21  // Serial Data
// Use I2S port 0
#define I2S_PORT I2S_NUM_0

// Define the I2S sample rate
#define I2S_SAMPLE_RATE 16000
// The INMP441 is a 24-bit microphone, but we read in 32-bit samples
#define I2S_SAMPLE_BITS I2S_BITS_PER_SAMPLE_32BIT

void Microphone::setup()
{

    // I2S configuration
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = I2S_SAMPLE_RATE,
        .bits_per_sample = I2S_SAMPLE_BITS,
        .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT, // Since L/R is grounded
        .communication_format = I2S_COMM_FORMAT_STAND_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 8,
        .dma_buf_len = 64,
        .use_apll = false,
        .tx_desc_auto_clear = false,
        .fixed_mclk = 0};

    // I2S pin configuration
    i2s_pin_config_t pin_config = {
        .bck_io_num = I2S_SCK_PIN,
        .ws_io_num = I2S_WS_PIN,
        .data_out_num = I2S_PIN_NO_CHANGE, // Not used
        .data_in_num = I2S_SD_PIN};

    // Install the I2S driver
    esp_err_t err = i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
    if (err != ESP_OK)
    {
        Serial.printf("Failed to install I2S driver: %d\n", err);
        while (true)
            ;
    }

    err = i2s_set_pin(I2S_PORT, &pin_config);
    if (err != ESP_OK)
    {
        Serial.printf("Failed to set I2S pins: %d\n", err);
        while (true)
            ;
    }

    Serial.println("I2S driver installed successfully.");
}

int Microphone::read(int32_t *samples, int read)
{
    size_t bytes_read;
    esp_err_t result = i2s_read(I2S_PORT, samples, read * sizeof(int32_t), &bytes_read, portMAX_DELAY);

    int samples_read = bytes_read / sizeof(int32_t);
    return samples_read;
}
