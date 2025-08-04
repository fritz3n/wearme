#include <cstdint>

class Microphone
{
public:
    static void setup();
    static int read(int32_t *samples, int read);
};