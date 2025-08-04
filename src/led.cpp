#include "led.h"
#include <FastLED.h>

#define LED_PIN 3

#define COLOR_ORDER GRB
#define CHIPSET WS2811

#define BRIGHTNESS 64

// Params for width and height
const uint8_t kMatrixWidth = MAT_WIDTH;
const uint8_t kMatrixHeight = MAT_HEIGHT;

// Param for different pixel layouts
const bool kMatrixSerpentineLayout = true;
const bool kMatrixVertical = false;

uint16_t XY(uint8_t x, uint8_t y)
{
    uint16_t i;

    if (kMatrixSerpentineLayout == false)
    {
        if (kMatrixVertical == false)
        {
            i = (y * kMatrixWidth) + x;
        }
        else
        {
            i = kMatrixHeight * (kMatrixWidth - (x + 1)) + y;
        }
    }

    if (kMatrixSerpentineLayout == true)
    {
        if (kMatrixVertical == false)
        {
            if (y & 0x01)
            {
                // Odd rows run backwards
                uint8_t reverseX = (kMatrixWidth - 1) - x;
                i = (y * kMatrixWidth) + reverseX;
            }
            else
            {
                // Even rows run forwards
                i = (y * kMatrixWidth) + x;
            }
        }
        else
        { // vertical positioning
            if (x & 0x01)
            {
                i = kMatrixHeight * (kMatrixWidth - (x + 1)) + y;
            }
            else
            {
                i = kMatrixHeight * (kMatrixWidth - x) - (y + 1);
            }
        }
    }

    return i;
}

#define NUM_LEDS (kMatrixWidth * kMatrixHeight)
CRGB leds_plus_safety_pixel[NUM_LEDS + 1];
CRGB *const LED::leds(leds_plus_safety_pixel + 1);

int idxs[MAT_WIDTH][MAT_HEIGHT];

void LED::setup()
{
    for (size_t i = 0; i < MAT_WIDTH; i++)
    {
        for (size_t j = 0; j < MAT_HEIGHT; j++)
        {
            idxs[i][j] = XY(i, j);
        }
    }

    FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalSMD5050);
    FastLED.setBrightness(BRIGHTNESS);
}

void LED::draw()
{
    FastLED.show();
}

void LED::setBrightness(uint8_t brightness)
{

    FastLED.setBrightness(brightness);
}

int LED::xyToIdx(int x, int y)
{
    if (x < 0 || x >= MAT_WIDTH || y < 0 || y >= MAT_HEIGHT)
        return -1;
    return idxs[x][y];
}
