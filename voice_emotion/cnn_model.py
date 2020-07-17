import torch
import torch.nn as nn


# Define the CNN network

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()

        self.net = nn.Sequential()

        self.net.add_module('cv1', nn.Conv2d(
            in_channels=13, out_channels=16, kernel_size=1, stride=1, padding=2))
        self.net.add_module('rl1', nn.ReLU())

        self.net.add_module('cv2', nn.Conv2d(
            in_channels=16, out_channels=32, kernel_size=1, stride=1, padding=0))
        self.net.add_module('rl2', nn.ReLU())

        self.net.add_module('cv3', nn.Conv2d(
            in_channels=32, out_channels=64, kernel_size=1, stride=1, padding=0))
        self.net.add_module('rl3', nn.ReLU())

        self.net.add_module('cv4', nn.Conv2d(
            in_channels=64, out_channels=128, kernel_size=1, stride=1, padding=0))
        self.net.add_module('rl4', nn.ReLU())

        self.net.add_module('mp1', nn.MaxPool2d(kernel_size=2))
        self.net.add_module('dp1', nn.Dropout2d(p=0.5))
        self.net.add_module('fl1', nn.Flatten())

        self.net.add_module('fc1', nn.Linear(
            in_features=2560, out_features=128))
        self.net.add_module('rl5', nn.ReLU())

        self.net.add_module('fc2', nn.Linear(in_features=128, out_features=64))
        self.net.add_module('rl6', nn.ReLU())

        self.net.add_module('fc3', nn.Linear(in_features=64, out_features=7))
        self.net.add_module('sm1', nn.Softmax(dim=1))

    def forward(self, x):
        return self.net(x)


# Create the model

emotion_model = Net()
