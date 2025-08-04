#include <FastLED.h>

#define MAT_WIDTH 11
#define MAT_HEIGHT 20
#define LED_XY(x, y) LED::leds[LED::xyToIdx(x, y)]

void ledSetup();

class LED
{
public:
    static void setup();
    static void draw();
    static void setBrightness(uint8_t);
    static int xyToIdx(int x, int y);

    static CRGB *const leds;
};
