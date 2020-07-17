from cnn_model import emotion_model
# from train_test_split import build_test_data

import torch
import torch.nn as nn
from torchvision import datasets, transforms
import torch.nn.functional as F

# Set hyper-parameters
bt_size = 32

# Dataloader for test dataset

test_data = build_test_data()
test_loader = torch.utils.data.DataLoader(
    test_data, batch_size=bt_size, shuffle=True)

# Test the model


def test(model, test_loader):
    model.eval()
    test_loss = 0
    test_accu = 0

    with torch.no_grad():

        # iterate through test set
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)

            # forward pass
            output = model(data)

            # bookkeeping
            test_loss += F.nll_loss(output, target,
                                    reduction='sum').item()  # loss
            test_accu += (output.argmax(dim=-1) ==
                          target).float().sum().item()  # accuracy

    test_loss /= len(test_loader.dataset)
    test_accu /= len(test_loader.dataset)

    print('\nTest set: Average Loss: {:.4f}, Accuracy: {:.2f}\n'.format(
        test_loss, test_accu))

    return test_loss, test_accu


test_loss, test_accu = test(emotion_model, test_loader)
