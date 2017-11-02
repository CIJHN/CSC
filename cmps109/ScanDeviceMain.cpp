//
// Created by CIJhn on 10/19/2016.
//

#include <assert.h>
#include "ScanningDevice.h"

int main() {
    ScanningDevice *device = new ScanningDevice();
    assert(device != nullptr);//test construct

    //test check in one product.
    device->checkIn(0);

    assert(device->numberOfProducts(0) == 1);
    assert(device->numberOfExistingProductTypes() == 1);
    assert(device->totalNumberOfProducts() == 1);

    //test check in multiple types of products.
    device->checkIn(1);
    assert(device->numberOfProducts(0) == 1);
    assert(device->numberOfExistingProductTypes() == 2);
    assert(device->totalNumberOfProducts() == 2);

    //test check in multiple products in one type.
    device->checkIn(0);
    assert(device->numberOfProducts(0) == 2);
    assert(device->numberOfExistingProductTypes() == 2);
    assert(device->totalNumberOfProducts() == 3);

    //test check out product.
    device->checkOut(1);
    assert(device->numberOfProducts(0) == 2);
    assert(device->numberOfExistingProductTypes() == 1);
    assert(device->totalNumberOfProducts() == 2);

    //test check in/out illegal product id.
    assert(!device->checkIn(-1));
    assert(!device->checkOut(10));
    assert(!device->checkIn(256));

    delete device;
}